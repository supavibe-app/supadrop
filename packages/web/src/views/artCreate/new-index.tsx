import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Row,
  Col,
  Card,
  Tabs,
  Form,
  Input,
  Upload,
  Switch,
  Image,
  Skeleton,
  Slider,
  Button,
  message,
  Steps,
} from 'antd';
import FeatherIcon from 'feather-icons-react';
import ActionButton from '../../components/ActionButton';
import {
  uFlexAlignItemsCenter,
  uFlexSpaceBetween,
  uTextAlignEnd,
} from '../../styles';
import {
  ArtTitleStyle,
  CardStyle,
  ErrorTextStyle,
  FormStyle,
  HeaderLabelStyle,
  ImageWrapper,
  InputStyle,
  InputWithSuffixStyle,
  PlaceholderStyle,
  TransparentInput,
  TabsStyle,
  TextAreaStyle,
  TitleSkeletonStyle,
  UsernameStyle,
  SliderStyle,
  InputWithAddon,
} from './style';
import getBase64 from '../../helpers/getBase64';
import {
  Creator,
  getAssetCostToStore,
  LAMPORT_MULTIPLIER,
  MAX_METADATA_LEN,
  MetadataCategory,
  shortenAddress,
  StringPublicKey,
  useConnection,
  useConnectionConfig,
} from '@oyster/common';
import { mintNFT, mintNFTIPFS } from '../../actions';
import { useWallet } from '@solana/wallet-adapter-react';
import { ArtContent } from '../../components/ArtContent';
import { MintLayout } from '@solana/spl-token';
import { useSolPrice } from '../../contexts';
import { CongratulationsNew } from '../../components/Congratulations';
import { LoadingOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Dragger } = Upload;
const { Step } = Steps;

const ArtCreateView = () => {
  const { publicKey } = useWallet();
  const { env } = useConnectionConfig();
  const connection = useConnection();
  const wallet = useWallet();
  const solPrice = useSolPrice();

  const [form] = Form.useForm();
  const [artTitle, setArtTitle] = useState('');
  const [previewColWidth, setPreviewColWidth] = useState(0);
  const [cost, setCost] = useState(0);

  const [showSplitter, setShowSplitter] = useState(false);
  const [totalSplitter, setTotalSplitter] = useState(0);

  const [nft, setNft] =
    useState<{ metadataAccount: StringPublicKey } | undefined>(undefined);
  const [nftCreateProgress, setNFTcreateProgress] = useState<number>(0);

  const [artFile, setArtFile] = useState<File | undefined>();
  const [artPreview, setArtPreview] = useState('');
  const [coverFile, setCoverFile] = useState<File | undefined>();
  const [coverImage, setCoverImage] = useState('');
  const [artCategory, setArtCategory] = useState<MetadataCategory>(
    MetadataCategory.Image,
  );
  const [isMinting, setMinting] = useState<boolean>(false);

  const previewColRef = useRef<HTMLDivElement>(null);
  const owner = shortenAddress(publicKey?.toBase58());

  useEffect(() => {
    const attributes = form.getFieldsValue();
    const files = [coverFile, artFile].filter(f => f) as File[];
    console.log(
      '🚀 ~ file: new-index.tsx ~ line 102 ~ useEffect ~ artFiles',
      artFile,
    );
    console.log(
      '🚀 ~ file: new-index.tsx ~ line 102 ~ useEffect ~ coverFiles',
      coverFile,
    );

    const metadata = {
      name: attributes.title,
      symbol: attributes.symbol || '',
      creators: attributes.creators,
      description: attributes.description,
      sellerFeeBasisPoints: attributes.royalties,
      image: coverFile?.name,
      animation_url: attributes.animation_url || '',
      attributes: attributes.attributes,
      external_url: attributes.external_url || '',
      properties: {
        files: files,
        category: artCategory,
      },
    };

    const rentCall = Promise.all([
      connection.getMinimumBalanceForRentExemption(MintLayout.span),
      connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN),
    ]);

    if (files.length) {
      getAssetCostToStore([
        ...files,
        new File([JSON.stringify(metadata)], 'metadata.json'),
      ]).then(async lamports => {
        const sol = lamports / LAMPORT_MULTIPLIER;

        // TODO: cache this and batch in one call
        const [mintRent, metadataRent] = await rentCall;

        // const uriStr = 'x';
        // let uriBuilder = '';
        // for (let i = 0; i < MAX_URI_LENGTH; i++) {
        //   uriBuilder += uriStr;
        // }

        const additionalSol = (metadataRent + mintRent) / LAMPORT_MULTIPLIER;

        // TODO: add fees based on number of transactions and signers
        setCost(sol + additionalSol);
      });
    } else {
      setCost(0);
    }
  }, [form, coverFile, artFile, setCost]);

  useEffect(() => {
    if (previewColRef.current?.offsetWidth)
      setPreviewColWidth(previewColRef.current?.offsetWidth);
  }, [previewColRef.current?.offsetWidth, setPreviewColWidth]);

  const onFieldsChange = changedFields => {
    const changedField = changedFields[0];

    if (changedField && changedField.name[0] === 'title') {
      setArtTitle(changedField.value);
    } else if (changedField && changedField.name[0] === 'split') {
      setShowSplitter(changedField.value);
    }
  };

  const setShareValue = (name, value) => {
    const formValue = form.getFieldsValue();
    formValue.creators[name].share = parseInt(value) || 0;
    form.setFieldsValue(formValue);

    const sumSplitter = formValue.creators.reduce(
      (n, { share }) => n + share,
      0,
    );
    setTotalSplitter(100 - sumSplitter);
  };

  const setSplitterEvenly = () => {
    const formValue = form.getFieldsValue();
    const creators = formValue.creators;
    const creatorSplitter = formValue.creators.map(creator => ({
      ...creator,
      share: 100 / creators.length,
    }));

    setTotalSplitter(0);

    formValue.creators = creatorSplitter;
    form.setFieldsValue(formValue);
  };

  const mint = async values => {
    const attributes = values;
    const files = [coverFile, artFile].filter(f => f) as File[];

    if (publicKey) {
      const creatorStructs: Creator[] = values.creators
        ? values.creators.map(
            c =>
              new Creator({
                address: c.address,
                verified: c.address === publicKey?.toBase58(),
                share: c.share,
              }),
          )
        : [
            new Creator({
              address: publicKey?.toBase58(),
              verified: true,
              share: 100,
            }),
          ];
      const metadata = {
        name: attributes.title,
        symbol: attributes.symbol || '',
        creators: creatorStructs,
        description: attributes.description,
        sellerFeeBasisPoints: attributes.royalties * 100,
        image: coverFile?.name,
        animation_url: attributes.animation_url || '',
        attributes: attributes.attributes,
        external_url: attributes.external_url || '',
        properties: {
          files: files,
          category: artCategory,
        },
      };

      try {
        setMinting(true);

        const _nft = await mintNFTIPFS(
          connection,
          wallet,
          env,
          files,
          metadata,
          setNFTcreateProgress,
          attributes.properties?.maxSupply,
          coverFile,
          artFile,
        );

        if (_nft) setNft(_nft);
      } catch (e: any) {
        message.error(e.message);
      } finally {
        setMinting(false);
        console.log('berhasil');
      }
    }
  };

  const onTabsChange = activeKey => {
    setArtCategory(activeKey);

    if (activeKey === MetadataCategory.Image) {
      setArtFile(coverFile);
      setArtPreview(coverImage);
    } else {
      setArtFile(undefined);
      setArtPreview('');
    }
  };

  const categoryTabs = [
    MetadataCategory.Image,
    MetadataCategory.Video,
    MetadataCategory.Audio,
    MetadataCategory.VR,
    MetadataCategory.HTML,
  ];

  const iconPlaceholder = (category: MetadataCategory) => {
    switch (category) {
      case MetadataCategory.Image:
        return 'image';
      case MetadataCategory.Video:
        return 'video';
      case MetadataCategory.Audio:
        return 'music';
      case MetadataCategory.VR:
        return 'box';
      case MetadataCategory.HTML:
        return 'layout';
      default:
        return 'image';
    }
  };

  const previewTabs = (category: MetadataCategory) => [
    {
      title: 'PREVIEW',
      icon: iconPlaceholder(category),
      show: true,
      thumbnail: artPreview,
      category: category,
    },
    {
      title: 'COVER IMAGE',
      icon: iconPlaceholder(MetadataCategory.Image),
      show: category !== MetadataCategory.Image,
      thumbnail: coverImage,
      category: MetadataCategory.Image,
    },
  ];

  if (isMinting) {
    return (
      <WaitingStep mint={mint} minting={isMinting} step={nftCreateProgress} />
    );
  }

  if (artPreview && nft) {
    return (
      <CongratulationsNew
        title="Your NFT is now ready!"
        description="You can start selling it on supadrop marketplace or check it on your profile"
        primaryText="sell nft"
        primaryAction={() => console.log('see on profile')}
        secondaryText="see on profile →"
        secondaryAction={() => console.log('see on profile')}
        artCard={
          <Card
            className={CardStyle}
            cover={
              <ArtContent
                uri={artPreview}
                animationURL={artPreview}
                category={artCategory}
                style={{ height: previewColWidth, width: '100%' }}
              />
            }
          >
            <div>
              <Skeleton
                className={TitleSkeletonStyle}
                paragraph={false}
                round
                title={{ width: 180 }}
                loading={!Boolean(artTitle)}
              >
                <div className={ArtTitleStyle}>{artTitle}</div>
              </Skeleton>
              <div className={UsernameStyle}>
                <Avatar size={32} />
                <span>{owner}</span>
              </div>
            </div>
          </Card>
        }
      />
    );
  }

  return (
    <Row justify="center" gutter={184} style={{ margin: '56px 0' }}>
      <Col span={12}>
        <Form
          form={form}
          labelAlign="left"
          className={FormStyle}
          onFieldsChange={onFieldsChange}
          onFinish={mint}
          requiredMark={false}
          initialValues={{ royalties: 10 }}
        >
          <div className={HeaderLabelStyle}>Choose format</div>

          <Tabs
            defaultActiveKey={MetadataCategory.Image}
            className={TabsStyle}
            onChange={onTabsChange}
          >
            {categoryTabs.map(tab => (
              <TabPane tab={tab} key={tab}>
                <UploadContainer
                  artFile={artFile}
                  artCategory={artCategory}
                  setCoverFile={setCoverFile}
                  setCoverImage={setCoverImage}
                  setArtFile={setArtFile}
                  setArtPreview={setArtPreview}
                  coverImage={coverImage}
                  artPreview={artPreview}
                />
              </TabPane>
            ))}
          </Tabs>

          <Form.Item
            name="title"
            label="TITLE"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message:
                  'Enter the title of your artwork to make it remarkable',
              },
            ]}
          >
            <Input
              className={InputStyle}
              placeholder={`e.g. "Portal to Heaven"`}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="DESCRIPTION"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message:
                  'Enter the description of your artwork to make it better',
              },
            ]}
          >
            <Input.TextArea
              className={TextAreaStyle}
              placeholder="story or any details about your artwork.."
              rows={1}
              autoSize
            />
          </Form.Item>

          <Form.Item
            name="royalties"
            label="ROYALTIES"
            labelCol={{ span: 24 }}
            extra={
              <div style={{ marginTop: 4 }}>suggestion 5%, 10% – max 20%</div>
            }
            rules={[
              {
                type: 'number',
                max: 20,
                min: 0,
                transform: value => parseInt(value),
                message: 'Royalties must be between 0 and 20',
                required: true,
              },
            ]}
          >
            <Input
              className={InputWithSuffixStyle}
              placeholder="royalties for the creators"
              suffix="%"
              type="number"
            />
          </Form.Item>

          <Form.Item
            name="split"
            label="CREATORS SPLIT"
            colon={false}
            className={uTextAlignEnd}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <p style={{ width: '80%' }}>
            with SUPADROP, you can split your payment and royalties with as many
            wallet addresses as you like.
          </p>

          {showSplitter && (
            <Form.List
              name="creators"
              initialValue={[
                { address: publicKey?.toBase58(), share: 50 },
                { address: '', share: 50 },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey }) => (
                    <div key={key}>
                      <Form.Item
                        name={[name, 'address']}
                        fieldKey={[fieldKey, 'address']}
                        rules={[
                          { required: true, message: 'Missing wallet address' },
                        ]}
                        hidden={key === 0}
                      >
                        <Input
                          className={InputWithAddon}
                          placeholder={`Wallet Address – Creator ${name + 1}`}
                          addonBefore={
                            key > 0 ? (
                              <FeatherIcon
                                icon="minus-square"
                                onClick={() => remove(name)}
                              />
                            ) : null
                          }
                          disabled={key === 0}
                        />
                      </Form.Item>

                      {key === 0 && (
                        <div className={uFlexSpaceBetween}>
                          <span>You</span>
                          <a onClick={setSplitterEvenly}>Split Evenly</a>
                        </div>
                      )}

                      <Row justify="space-between">
                        <Col span={19}>
                          <Form.Item noStyle>
                            <Slider
                              className={SliderStyle}
                              onChange={value => setShareValue(name, value)}
                              value={form.getFieldValue([
                                'creators',
                                name,
                                'share',
                              ])}
                              tooltipVisible={false}
                              min={0}
                              max={
                                totalSplitter +
                                form.getFieldValue(['creators', name, 'share'])
                              }
                              disabled={
                                totalSplitter +
                                  form.getFieldValue([
                                    'creators',
                                    name,
                                    'share',
                                  ]) <=
                                0
                              }
                            />
                          </Form.Item>
                        </Col>

                        <Col span={4}>
                          <Form.Item name={[name, 'share']} noStyle>
                            <Input
                              className={TransparentInput}
                              suffix="%"
                              onChange={e =>
                                setShareValue(name, e.target.value)
                              }
                              value={form.getFieldValue([
                                'creators',
                                name,
                                'share',
                              ])}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  ))}

                  <Button
                    className={uFlexAlignItemsCenter}
                    type="link"
                    onClick={() => add({ share: 0 })}
                    icon={<FeatherIcon icon="plus-square" />}
                  >
                    add new address
                  </Button>
                </>
              )}
            </Form.List>
          )}

          <div
            className={uFlexSpaceBetween}
            style={{ marginTop: 48, marginBottom: 48 }}
          >
            <div>COST TO CREATE</div>
            <div>
              ◎ {cost.toFixed(5)} (${(cost * solPrice).toFixed(2)})
            </div>
          </div>

          <ActionButton onClick={() => form.submit()} width="100%">
            CREATE ITEM
          </ActionButton>
        </Form>
      </Col>

      <Col span={8}>
        <div ref={previewColRef}>
          <div style={{ position: 'fixed', width: previewColWidth }}>
            <Tabs className={TabsStyle}>
              {previewTabs(artCategory).map(tab =>
                tab.show ? (
                  <TabPane tab={tab.title} key={tab.title}>
                    <Card
                      className={CardStyle}
                      cover={
                        tab.thumbnail ? (
                          <ArtContent
                            uri={tab.thumbnail}
                            animationURL={tab.thumbnail}
                            category={tab.category}
                            style={{ height: previewColWidth, width: '100%' }}
                          />
                        ) : (
                          <div className={PlaceholderStyle(previewColWidth)}>
                            <FeatherIcon icon={tab.icon} size="64" />
                          </div>
                        )
                      }
                    >
                      <div>
                        <Skeleton
                          className={TitleSkeletonStyle}
                          paragraph={false}
                          round
                          title={{ width: 180 }}
                          loading={!Boolean(artTitle)}
                        >
                          <div className={ArtTitleStyle}>{artTitle}</div>
                        </Skeleton>
                        <div className={UsernameStyle}>
                          <Avatar size={32} />
                          <span>{owner}</span>
                        </div>
                      </div>
                    </Card>
                  </TabPane>
                ) : null,
              )}
            </Tabs>
          </div>
        </div>
      </Col>
    </Row>
  );
};

const UploadContainer = ({
  artCategory,
  setCoverFile,
  setCoverImage,
  coverImage,
  setArtFile,
  setArtPreview,
  artPreview,
}: {
  artCategory: MetadataCategory;
  setCoverFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  setArtFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  setCoverImage: React.Dispatch<React.SetStateAction<string>>;
  setArtPreview: React.Dispatch<React.SetStateAction<string>>;
  artFile: File | undefined;
  coverImage: string;
  artPreview: string;
}) => {
  const [coverArtError, setCoverArtError] = useState<string>();

  const resetArtFile = () => {
    setArtFile(undefined);
    setArtPreview('');
  };

  const resetCoverFile = () => {
    setCoverFile(undefined);
    setCoverImage('');

    if (artCategory === MetadataCategory.Image) {
      resetArtFile();
    }
  };

  const acceptableFiles = (category: MetadataCategory) => {
    switch (category) {
      case MetadataCategory.Image:
        return '.png,.jpg,.gif,.svg';
      case MetadataCategory.Video:
        return '.mp4,.mov,.webm';
      case MetadataCategory.Audio:
        return '.mp3,.flac,.wav';
      case MetadataCategory.VR:
        return '.glb';
      case MetadataCategory.HTML:
        return '.html';
      default:
        return '';
    }
  };

  const draggerProps = (artCategory, isCover) => ({
    accept: acceptableFiles(artCategory),
    style: {
      border: '2px dashed #444444',
      background: 'transparent',
      borderRadius: 4,
      padding: '20px 0',
    },
    showUploadList: false,
    multiple: false,
    customRequest: info => {
      // dont upload files here, handled outside of the control
      info?.onSuccess?.({}, null as any);
    },
    onChange: async info => {
      const { status, originFileObj: file } = info.file;

      if (!file || status === 'uploading') {
        return;
      }

      const sizeKB = file.size / 1024;

      if (sizeKB < 25) {
        setCoverArtError(
          `The file ${file.name} is too small. It is ${
            Math.round(10 * sizeKB) / 10
          }KB but should be at least 25KB.`,
        );
        return;
      }

      const preview = await getBase64(file);
      if (isCover) {
        setCoverImage(typeof preview === 'string' ? preview : '');
        setCoverFile(file);
        setCoverArtError('');

        if (artCategory === MetadataCategory.Image) {
          setArtPreview(typeof preview === 'string' ? preview : '');
          setArtFile(file);
        }
      } else {
        setArtPreview(typeof preview === 'string' ? preview : '');
        setArtFile(file);
      }
    },
  });

  return (
    <div>
      {artCategory !== MetadataCategory.Image && (
        <>
          {Boolean(artPreview) ? (
            <div className={ImageWrapper}>
              <video
                playsInline={true}
                autoPlay={true}
                muted={true}
                controls={true}
                controlsList="nodownload"
                loop={true}
                width="80%"
                style={{ borderRadius: 2 }}
              >
                <source src={artPreview} type="video/mp4" />
              </video>
              <span
                style={{
                  color: '#444444',
                  position: 'absolute',
                  right: '5%',
                  cursor: 'pointer',
                }}
                onClick={resetArtFile}
              >
                <FeatherIcon icon="x-circle" size="32" />
              </span>
            </div>
          ) : (
            <Dragger {...draggerProps(artCategory, false)}>
              <p className="ant-upload-text">
                <b>upload file</b>
              </p>
              <p className="ant-upload-hint">
                {acceptableFiles(artCategory)
                  .replaceAll('.', ' ')
                  .toUpperCase()}
              </p>
              <p>MAX 2GB</p>
            </Dragger>
          )}

          <div className={HeaderLabelStyle} style={{ marginTop: 48 }}>
            Cover Image
          </div>
        </>
      )}

      {coverImage ? (
        <div className={ImageWrapper}>
          <Image
            src={coverImage}
            width="80%"
            preview={false}
            style={{ borderRadius: 2 }}
          />
          <span
            style={{
              color: '#444444',
              position: 'absolute',
              right: '5%',
              cursor: 'pointer',
            }}
            onClick={resetCoverFile}
          >
            <FeatherIcon icon="x-circle" size="32" />
          </span>
        </div>
      ) : (
        <>
          <Dragger {...draggerProps(MetadataCategory.Image, true)}>
            <p className="ant-upload-text">
              <b>upload file</b>
            </p>
            <p className="ant-upload-hint">PNG, JPG, GIF, SVG,</p>
            <p>MAX 2GB</p>
          </Dragger>

          {Boolean(coverArtError) && (
            <div className={ErrorTextStyle}>{coverArtError}</div>
          )}
        </>
      )}
    </div>
  );
};

const WaitingStep = (props: {
  mint: Function;
  minting: boolean;
  step: number;
}) => {
  const setIconForStep = (currentStep: number, componentStep) => {
    if (currentStep === componentStep) {
      return <LoadingOutlined />;
    }
    return null;
  };

  return (
    <div
      style={{
        marginTop: 70,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Card>
        <Steps direction="vertical" current={props.step}>
          <Step
            className={'white-description'}
            title="Minting"
            description="Starting Mint Process"
            icon={setIconForStep(props.step, 0)}
          />
          <Step
            className={'white-description'}
            title="Preparing Assets"
            icon={setIconForStep(props.step, 1)}
          />
          <Step
            className={'white-description'}
            title="Signing Metadata Transaction"
            description="Approve the transaction from your wallet"
            icon={setIconForStep(props.step, 2)}
          />
          <Step
            className={'white-description'}
            title="Sending Transaction to Solana"
            description="This will take a few seconds."
            icon={setIconForStep(props.step, 3)}
          />
          <Step
            className={'white-description'}
            title="Waiting for Initial Confirmation"
            icon={setIconForStep(props.step, 4)}
          />
          <Step
            className={'white-description'}
            title="Waiting for Final Confirmation"
            icon={setIconForStep(props.step, 5)}
          />
          <Step
            className={'white-description'}
            title="Uploading to IPFS"
            icon={setIconForStep(props.step, 6)}
          />
          <Step
            className={'white-description'}
            title="Updating Metadata"
            icon={setIconForStep(props.step, 7)}
          />
          <Step
            className={'white-description'}
            title="Signing Token Transaction"
            description="Approve the final transaction from your wallet"
            icon={setIconForStep(props.step, 8)}
          />
        </Steps>
      </Card>
    </div>
  );
};

export default ArtCreateView;
