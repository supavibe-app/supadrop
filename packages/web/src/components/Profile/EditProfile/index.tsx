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

const { TextArea } = Input;
const maxChar = 280;

const EditProfile = ({ closeEdit, refetch, userData }: { closeEdit: () => void; refetch: () => void; userData: object; }) => {
  const { publicKey } = useWallet();
  const [form] = Form.useForm();
  const [bio, setBio] = useState(''); // to get the length of bio

  const saveProfile = async (values) => {
    let { data, error } = await supabase.from('user_data')
      .update([{ ...values, img_profile: '' }])
      .eq('wallet_address', publicKey)
      .limit(1)

    if (error) {
      console.log(error);
      message.error(`update profile failed, reason: ${error}`);
      return;
    }

    if (data != null) {
      message.success('profile updated 🎉');
      refetch();
      closeEdit();
    }
  };

  return (
    <div>
      <div className={EditProfileTitle}>edit profile</div>

      <div>
        <div className={UploadImageContainer}>
          <div>
            <Upload className={UploadStyle}>
              <Avatar size={86} icon={<FeatherIcon icon="image" size="32" />} style={{ cursor: 'pointer' }} />
            </Upload>
          </div>

          <div>
            <div>We recommend an image of at least 400x400.</div>

            <Upload className={UploadStyle}>
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
          <Form.Item className={FormItemStyle} name="name" label="name">
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
