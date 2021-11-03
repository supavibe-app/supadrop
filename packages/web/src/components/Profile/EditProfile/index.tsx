import React, { useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import { Avatar, Button, Form, Input, Upload, message } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';

import ActionButton from '../../ActionButton';
import { supabase } from '../../../../supabaseClient';
import urlValidator from '../../../helpers/urlValidator';
import {
  BioLabel,
  CancelButton,
  ChooseFileButton,
  EditProfileTitle,
  FormItemStyle,
  InputPrefixStyle,
  InputStyle,
  TextAreaStyle,
  UploadImageContainer,
  UploadStyle,
} from './style';
import { UserData } from '@oyster/common';
import { useHistory } from 'react-router';
// import { replace } from 'lodash';

const { TextArea } = Input;
const maxChar = 280;
const BASE_STORAGE_URL = "https://fjgyltuahsuzqqkdnhay.supabase.in/storage/v1/object/public/profile/avatars/" // TODO NEED TO MOVE or CHANGE

const EditProfile = ({ closeEdit, refetch, userData }: { closeEdit: () => void; refetch: () => void; userData: UserData | undefined; }) => {
  const { replace } = useHistory();
  const { publicKey } = useWallet();
  const [form] = Form.useForm();
  const [bio, setBio] = useState(userData?.bio || ''); // to get the length of bio
  const [file, setFile] = useState<File>();
  const [avatarUrl, setAvatarUrl] = useState<String>();

  async function deleteLastImage() {
    let exProfpic;
    if (userData?.img_profile) {
      exProfpic = userData.img_profile.split("/");
      await supabase
        .storage
        .from('profile')
        .remove([`avatars/${userData?.wallet_address}_${exProfpic[exProfpic.length - 1]}`])
    }
  }

  // will return localhost link just for temp data
  async function downloadImage(path) {
    console.log('downloadImage: ', path)
    const { data, error } = await supabase.storage.from('profile').download(`avatars/${userData?.wallet_address}_${path}`)
    if (error) {
      throw error
    }
    const url = URL.createObjectURL(data)
    setAvatarUrl(url)
  }

  // NEED CLEAN THE CODE FOR THIS FUNC MAYBE
  const saveProfile = async (values) => {
    let imageProfile = '';
    let userName = true;

    let { data: user_data, error: error_user } = await supabase
      .from('user_data')
      .select('username');

    user_data?.some( dataUsername => {
      console.log('username', dataUsername);
      if (dataUsername.username == values.username && values.username != userData?.username) {
        message.error(`update profile failed, reason: ${values.username} already taken`);
        userName = false;
        return;
      }
    })

    if (!userName) {
      return;
    }

    if (file) {
      deleteLastImage();

      imageProfile = `${BASE_STORAGE_URL}${userData?.wallet_address}_${file?.name}`;
    } else imageProfile = userData?.img_profile || '';

    let { data, error } = await supabase.from('user_data')
      // .update([{ ...values, img_profile: avatarUrl }])
      .update([{ ...values, img_profile: imageProfile }])
      .eq('wallet_address', publicKey)
      .limit(1);

    if (error || error_user) {
      console.log(error);
      if (error) {
        message.error(`update profile failed, reason: ${error}`);
      } else if (error_user) {
        message.error(`update profile failed, reason: ${error_user}`);
      }
      
      return;
    }

    if (data != null) {
      message.success('profile updated 🎉');
      if (values.username) {
        replace(`/${values.username}`);
      }
      refetch();
      closeEdit();
    }
  };

  const onUpload = async (event) => {
    console.log('onUpload', typeof event);
    if (file) {
      deleteLastImage();
    }
    setFile(event);
    const { error: uploadError } = await supabase.storage
      .from('profile')
      .upload(`avatars/${userData?.wallet_address}_${event.name}`, event);

    if (uploadError) {
      downloadImage(event.name);
      // message.error(`upload failed, reason: ${uploadError.message}`);
      throw uploadError
    } else downloadImage(event.name);

    return ''
  }

  const props = {
    action: onUpload,
    onStart(file) {
      console.log('onStart file', file);
      console.log('onStart file name', file.name);
    },
    onSuccess(ret) {
      console.log('onSuccess', ret);
      onUpload
    },
    onError(err) {
      console.log('onError', err);
    },
    beforeUpload(file) {
      console.log(file);
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload PNG file!');
      }
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        message.error('Image must smaller than 1MB!');

      }
      return isJpgOrPng && isLt1M;
    },
  };

  return (
    <div>
      <div className={EditProfileTitle}>edit profile</div>

      <div>
        <div className={UploadImageContainer}>
          <div>
            <Upload {...props} className={UploadStyle}>
              {userData?.img_profile && avatarUrl && <Avatar size={86} src={avatarUrl} style={{ cursor: 'pointer' }} />}
              {userData?.img_profile && !avatarUrl && <Avatar size={86} src={userData.img_profile} style={{ cursor: 'pointer' }} />}
              {!userData?.img_profile && !avatarUrl && <Avatar size={86} icon={<FeatherIcon icon="image" size="32" />} style={{ cursor: 'pointer' }} />}
            </Upload>
          </div>

          <div>
            <div>We recommend an image of at least 400x400.</div>

            <Upload {...props} className={UploadStyle}>
              <Button className={ChooseFileButton} type="link">choose file</Button>
            </Upload>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={userData}
          autoComplete="off"
          onFinish={saveProfile}
        >
          <Form.Item
            className={FormItemStyle}
            name="name"
            label="name"
            rules={[
              { type: 'string', max: 52, message: 'max 52 characters' },
            ]}
          >
            <Input className={InputStyle} />
          </Form.Item>

          <Form.Item
            className={FormItemStyle}
            name="username"
            label="username"
            rules={[
              { type: 'string', max: 16, message: 'max 16 characters' },
              { type: 'string', min: 2, message: 'min 2 characters' },
              { type: 'string', pattern: /^[A-Za-z0-9_]+$/, message: 'cannot use symbol' }
            ]}
          >
            <Input className={InputPrefixStyle} prefix="@" />
          </Form.Item>

          <Form.Item
            className={FormItemStyle}
            name="twitter"
            label="twitter handle"
            rules={[
              { pattern: /^@?(\w){1,15}$/, message: 'invalid Twitter username' }
            ]}
          >
            <Input className={InputPrefixStyle} prefix="@" />
          </Form.Item>

          <Form.Item
            className={FormItemStyle}
            name="website"
            label="website"
            rules={[
              { pattern: urlValidator, message: 'please enter a valid and secure url' },
            ]}
          >
            <Input className={InputStyle} placeholder="https://" />
          </Form.Item>

          <Form.Item
            className={FormItemStyle}
            name="bio"
            label={(
              <div className={BioLabel}>
                <div>add short bio</div>
                <div>{bio.length}/{maxChar}</div>
              </div>
            )}
            rules={[{ type: 'string', max: maxChar, message: `max ${maxChar} characters` }]}
          >
            <TextArea className={TextAreaStyle} placeholder="enter short bio" rows={8} onChange={e => setBio(e.target.value)} />
          </Form.Item>

          <Form.Item>
            <ActionButton width="100%" size="small" onClick={form.submit}>SAVE CHANGE</ActionButton>
            <Button className={CancelButton} type="link" onClick={closeEdit}>CANCEL</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
