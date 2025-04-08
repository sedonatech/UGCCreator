import Mailer from 'react-native-mail';
import DocumentPicker from 'react-native-document-picker';
import PropTypes from 'prop-types';
import { useState } from 'react';

const useMailCompose = () => {
    const [mailEvent, setMailEvent] = useState('');
    const sendEmailWithAttachment = async (metaData) => {
        const {
            recipients,
            body,
            attachments,
            subject,
        } = metaData;

        try {
            if (__DEV__) return setMailEvent('sent');
            await Mailer.mail({
                recipients,
                subject,
                body,
                attachments,
            },
            (error, event) => {
                if (error) {
                    console.error(error);
                } else if (event === 'sent') {
                    setMailEvent('sent');
                } else if (event === 'cancelled') {
                    setMailEvent('cancelled');
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const composeEmailWithAttachment = async (recipientEmail) => {
        try {
            if (__DEV__) return setMailEvent('sent');
            const res = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                copyTo: 'cachesDirectory',
            });
            const { uri, type, name } = await res;

            const metaData = {
                recipients: [recipientEmail],
                body: '',
                subject: '',
                attachments: [{
                    uri,
                    mimeType: type,
                    name,
                }],
            };
            await sendEmailWithAttachment(metaData);
        } catch (error) {
            console.error(error);
        }
    };

    return {
        sendEmailWithAttachment,
        composeEmailWithAttachment,
        mailEvent,
        setMailEvent,
    };
};

useMailCompose.propTypes = {
    metaData: PropTypes.shape({
        pdfPath: PropTypes.string,
        recipients: PropTypes.arrayOf(PropTypes.string),
        body: PropTypes.string,
        subject: PropTypes.string,
        attachments: PropTypes.arrayOf(PropTypes.shape({
            uri: PropTypes.string,
            mimeType: PropTypes.string,
            fileName: PropTypes.string,
        })),
    }),
};

useMailCompose.defaultProps = {
    metaData: {
        pdfPath: '',
        recipients: [],
        body: '',
        attachments: [],
    },
};

export default useMailCompose;
