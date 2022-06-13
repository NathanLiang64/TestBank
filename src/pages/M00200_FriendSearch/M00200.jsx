import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import uuid from 'react-uuid';

import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import Loading from 'components/Loading';
import Avatar from 'components/Avatar';
import {dateFormatter, stringToDate } from 'utilities/Generator';

import { getFriends } from './api';
import PageWrapper from './M00200.style';

/**
 * M00200 好友查詢
 */
const Page = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [friends, setFriends] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getFriends();
    setFriends(response);
    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="好友查詢" goBackFunc={() => history.goBack()}>
      <Main>
        <PageWrapper>
          { friends ? (
            <ul className="friend-list">
              {friends.map((f) => (
                <li key={uuid()}>
                  <div>
                    <Avatar small src={f.friendUuid} name={f.friendName} />
                  </div>
                  <div className="flex-auto">
                    <div className="title">
                      {f.friendName}
                    </div>
                    <div className="note">
                      {f.depositApproved && (
                      <div>
                        開戶：
                        {dateFormatter(stringToDate(f.depositApproved))}
                      </div>
                      )}
                      {f.creditCardApproved && (
                      <div>
                        核卡：
                        {dateFormatter(stringToDate(f.creditCardApproved))}
                      </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : <Loading space="both" isCentered /> }
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
