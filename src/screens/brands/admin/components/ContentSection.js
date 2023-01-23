import React, {useLayoutEffect, useState} from 'react';
import useFirebaseGetStorage from '../../../../hooks/imageUpload/useFirebaseGetStorage';
import ContentCard from '../../../../components/cards/ContentCard';

const defaultImage =
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60';
const ContentSection = ({creator, isLast, hasRequest}) => {
  const [avatar, setAvatar] = useState('');
  const {getAvatar} = useFirebaseGetStorage();
  const getCreatorAvatar = async id => {
    try {
      let avatar;
      const response = await getAvatar(id);
      if (response?.url) {
        avatar = response?.url;
      } else {
        avatar = defaultImage;
      }

      return avatar;
    } catch (error) {
      console.log('error', error);
    }
  };

  useLayoutEffect(() => {
    (async () => {
      const avatarUrl = await getCreatorAvatar(creator?.id);
      setAvatar(avatarUrl);
    })();
  }, [creator]);

  return (
    <ContentCard
      image={{uri: avatar}}
      title={creator?.userName}
      subtitle={'Berlin, Germany'}
      buttonTitle={hasRequest ? 'review' : ''}
      callout={hasRequest ? '' : 'yesterday'}
      isLast={isLast}
    />
  );
};

export default ContentSection;
