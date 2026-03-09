import Mailer from 'react-native-mail';
import DocumentPicker from 'react-native-document-picker';
import PropTypes from 'prop-types';
import { useState } from 'react';

const useMailCompose = () => {
    const [mailEvent, setMailEvent] = useState('');

    const sendEmailWithAttachment = metaData => {
        const { recipients, body, attachments, subject, isHTML } = metaData;

        Mailer.mail(
            {
                subject,
                recipients,
                body,
                isHTML: isHTML !== false,
                attachments,
            },
            (error, event) => {
                if (error) {
                    console.error('Mail error:', error);
                } else if (event === 'sent') {
                    setMailEvent('sent');
                } else if (event === 'cancelled') {
                    setMailEvent('cancelled');
                }
            },
        );
    };

    const composeEmailWithAttachment = async recipientEmail => {
        try {
            const res = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                copyTo: 'cachesDirectory',
            });
            const { uri, type, name } = res;

            sendEmailWithAttachment({
                recipients: [recipientEmail],
                body: '',
                subject: '',
                attachments: [
                    {
                        path: uri,
                        type: type,
                        name,
                    },
                ],
            });
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
        attachments: PropTypes.arrayOf(
            PropTypes.shape({
                path: PropTypes.string,
                type: PropTypes.string,
                name: PropTypes.string,
            }),
        ),
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
