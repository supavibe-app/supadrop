import React, { useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import { Avatar, Button, Form, Input, Upload } from 'antd';
import ActionButton from '../../components/ActionButton';
import { BioLabel, ChooseFileButton, EditProfileTitle, FormItemStyle, InputPrefixStyle, InputStyle, TextAreaStyle, UploadImageContainer } from './style';

const { TextArea } = Input;

const EditProfile = ({ closeEdit }: { closeEdit: () => void }) => {
  const [form] = Form.useForm();
  const [bio, setBio] = useState('');

  return (
    <div>
      <div className={EditProfileTitle}>edit profile</div>

      <div>
        <div className={UploadImageContainer}>
          <div>
            <Upload>
              <Avatar size={128} icon={<FeatherIcon icon="image" size="42" />} style={{ cursor: 'pointer' }} />
            </Upload>
          </div>

          <div>
            <span>
              We recommend an image of at least 400x400.
            </span>

            <Upload>
              <Button className={ChooseFileButton} type="link">choose file</Button>
            </Upload>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{}}
          autoComplete="off"
        >
          <Form.Item className={FormItemStyle} label="name">
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
            label="website"
            name="website"
            rules={[
              { pattern: /^https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/, message: 'please enter a valid and secure url' }
            ]}
          >
            <Input className={InputStyle} placeholder="https://" />
          </Form.Item>

          <Form.Item
            className={FormItemStyle}
            label={(
              <div className={BioLabel}>
                <div>add short bio</div>
                <div>{bio.length}/280</div>
              </div>
            )}
            name="bio"
            rules={[{ type: 'string', max: 280, message: 'max 280 characters' }]}
          >
            <TextArea className={TextAreaStyle} placeholder="enter short bio" rows={8} onChange={e => setBio(e.target.value)} />
          </Form.Item>

          <Form.Item>
            <ActionButton width="100%" size="small" onClick={closeEdit}>SAVE CHANGE</ActionButton>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
