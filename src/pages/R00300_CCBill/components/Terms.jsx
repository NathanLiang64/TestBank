import { useState } from 'react';
import parse from 'html-react-parser';

import Accordion from 'components/Accordion';
import Loading from 'components/Loading';

import { getCreditCardTerms } from '../api';

const Terms = () => {
  const [terms, setTerms] = useState();
  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getCreditCardTerms());
  };

  return (
    <Accordion title="注意事項" onClick={lazyLoadTerms}>
      { terms ? parse(terms) : <Loading space="both" isCentered /> }
    </Accordion>
  );
};

export default Terms;
