import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import Avatar from 'components/Avatar';
import {dateFormatter, stringToDate, toHalfWidth } from 'utilities/Generator';

import EmptyData from 'components/EmptyData';
import { getFriends } from './api';
import PageWrapper from './M00200.style';

/**
 * M00200 好友查詢
 */
const Page = () => {
  const dispatch = useDispatch();
  const [friends, setFriends] = useState([]);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getFriends();
    setFriends(response);
    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="好友查詢">
      <Main>
        { friends.length ? (
          <PageWrapper>
            <ul className="friend-list">
              {friends.map((f) => (
                <li key={f.friendUuid}>
                  <div>
                    <Avatar
                      small
                      src={`${process.env.REACT_APP_AVATAR_IMG_URL}/pf_${f.friendUuid}_b.jpg?timestamp=${Date.now()}`}
                      name={f.friendName.trim()}
                    />
                  </div>
                  <div className="flex-auto">
                    <div className="title">
                      {toHalfWidth(f.friendName)}
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
          </PageWrapper>
        ) : <EmptyData content="查無好友資料" />}
      </Main>
    </Layout>
  );
};

export default Page;
