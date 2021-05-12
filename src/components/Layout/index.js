import { Route, Switch } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import routes from 'route';

/* Components */
// import Login from 'pages/Login';

/* eslint-disable arrow-body-style */
const Layout = () => {
  // const userInfo = useSelector(({ login }) => login.userInfo);

  // return (
  //   !userInfo
  //     ? <Login />
  //     : (
  //       <>
  //         <main>
  //           <Switch>
  //             {
  //               routes.map((route) => {
  //                 const { path, exact, component } = route;
  //                 return <Route key={path} path={path} exact={exact} component={component} />;
  //               })
  //             }
  //           </Switch>
  //         </main>
  //       </>
  //     )
  // );

  return (
    <>
      <main>
        <Switch>
          {
            routes.map((route) => {
              const { path, exact, component } = route;
              return <Route key={path} path={path} exact={exact} component={component} />;
            })
          }
        </Switch>
      </main>
    </>
  );
};

export default Layout;
