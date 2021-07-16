import Head from 'next/head'
import Headers from '../components/Headers'
import Menus from '../components/Menus'
import { Provider } from 'react-redux'
import store from '../store'
import {useEffect,useState} from 'react'
import ls from 'local-storage'
import Router from 'next/router'
import { Layout, BackTop  } from "antd";
import queryString from "query-string";
import { useRouter } from 'next/router'

const { Header, Content, Footer, Sider } = Layout;


const Layouts = ({children}) => {
  const router = useRouter()
  router.query = queryString.parse(router.asPath.split(/\?/)[1]);
  var {route} = router;
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    let user = ls('user');
    if(!user){
      Router.push('/login')
    }else{
      let role = user.user.roles[0].name;
      setUserRole(role);
      if(role == "teacher" && route != "/"){
        Router.push('/401')
      }
    }
  }, []);
  const [collapsed, setCollapsed] = useState(true);
  const containerLayout = {
    containerStyle: { margin: '0 16px'},
    containerChildDivClassName: { className:"site-layout-background" } 
  };
  if(route == "/" && userRole == "admin"){
    containerLayout.containerStyle = { margin: '0 16px', background: "rgba((0, 0, 0, 0.65)"};
    containerLayout.containerChildDivClassName = { className:"site-layout-background-index" };
  }
  return (
    <Provider store={store}>
      <Headers />
      <Layout style={{ minHeight: '100vh' }}>
        { userRole == "admin" ? <Menus /> : <></> }
        <Layout className="site-layout">
          {/* <Header /> */}
          <br />
          <Content style={{...containerLayout.containerStyle}} >
            <div {...containerLayout.containerChildDivClassName} style={{ padding: 24, minHeight: '100%' }}>
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            <div>
              {/* <img src="/images/logo.png" className="h-10 w-10 full mx-auto" alt=""/> */}
              &copy; 2020 Student Performance Tracking System<br />
            </div>
             
          </Footer>
        </Layout>
        <BackTop />
      </Layout>
    </Provider>
  );
}
export default Layouts;
