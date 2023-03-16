import Mailer from 'react-native-mail';
import DocumentPicker from 'react-native-document-picker';
import PropTypes from 'prop-types';

const useMailCompose = () => {
    const sendEmailWithAttachment = async (metaData) => {
        const {
            recipients,
            body,
            attachments,
            subject,
        } = metaData;

        try {
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
                    console.log('sent');
                } else if (event === 'cancelled') {
                    console.log('cancelled');
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const composeEmailWithAttachment = async (recipientEmail) => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
            const { uri, type, name } = res;
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
