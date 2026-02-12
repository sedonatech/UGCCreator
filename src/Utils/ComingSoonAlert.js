import { Alert } from 'react-native';
import i18n from '../i18n';

export default () => Alert.alert(i18n.t('common.alerts.comingSoon.title'), i18n.t('common.alerts.comingSoon.message'));
