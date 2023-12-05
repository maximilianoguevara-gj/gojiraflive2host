import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

const {
  REACT_APP_EVENTS_API_GW_ENDPOINT,
} = process.env;

if (REACT_APP_EVENTS_API_GW_ENDPOINT === undefined) {
  throw Error('EVENTS_API_GW_ENDPOINT is undefined');
}

interface MessagingProps {
  callId: string
  onCatalogChanged?: () => void
  onFeatureProductChanged?: (featureProductIds: string[]) => void
}

export const useEvents = ({
  callId,
  onCatalogChanged = () => {},
  onFeatureProductChanged = () => {},
}: MessagingProps) => {
  if (callId === undefined) {
    return;
  }

  const { lastJsonMessage } = useWebSocket(REACT_APP_EVENTS_API_GW_ENDPOINT, {
    queryParams: {
      callId: callId!,
    },
  });

  useEffect(() => {
    if (lastJsonMessage === null) {
      return;
    }

    if (lastJsonMessage.event.name === 'CATALOG_CHANGED') {
      onCatalogChanged();
    } else if (lastJsonMessage.event.name === 'FEATURE_PRODUCT_CHANGED') {
      onFeatureProductChanged(lastJsonMessage.event.data.featureProductIds);
    }
  }, [lastJsonMessage]);
};
