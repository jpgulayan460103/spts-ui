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
  useEffect(() => {
    let user = ls('user');
    if(!user){
      Router.push('/login')
    }
  }, []);
  const [collapsed, setCollapsed] = useState(true);
  const containerLayout = {
    containerStyle: { margin: '0 16px'},
    containerChildDivClassName: { className:"site-layout-background" } 
  };
  if(route == "/"){
    containerLayout.containerStyle = { margin: '0 16px', background: "rgba((0, 0, 0, 0.65)"};
    containerLayout.containerChildDivClassName = { className:"site-layout-background-index" };
  }
  return (
    <Provider store={store}>
      <Layout style={{ minHeight: '100vh' }}>
        <Menus />
        <Layout className="site-layout">
          <Header />
          <Headers />
          <br />
          <Content style={{...containerLayout.containerStyle}}>
            <div {...containerLayout.containerChildDivClassName} style={{ padding: 24, minHeight: '100%' }}>
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Barangay Information System @2020</Footer>
        </Layout>
        <BackTop />
      </Layout>
    </Provider>
  );
}
export default Layouts;
