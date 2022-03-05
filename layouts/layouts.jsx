import React, {useEffect,useState} from 'react'
import { connect } from 'react-redux';
import Head from 'next/head'
import Headers from '../components/Headers'
import Menus from '../components/Menus'
import { Provider } from 'react-redux'
import store from '../store'
import ls from 'local-storage'
import Router from 'next/router'
import { Layout, BackTop, Menu  } from "antd";
import { DashboardOutlined, UserOutlined, TeamOutlined, ApartmentOutlined, SolutionOutlined, ReadOutlined } from '@ant-design/icons';
import queryString from "query-string";
import { useRouter } from 'next/router'
import Link from 'next/link'

const { Header, Content, Footer, Sider } = Layout;


function mapStateToProps(state) {
  return {
    sentCount: state.smsBlast.sentCount,
    recipients: state.smsBlast.recipients,
    sendStatus: state.smsBlast.sendStatus,
    menuCollapsed: state.appDefault.menuCollapsed,
    role: state.user.role,
  };
}


const Layouts = (props) => {
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
    <div>
      {/* <Headers /> */}
      <Layout style={{ minHeight: '100vh' }}>
        {/* { userRole == "admin" ? <Menus /> : <></> } */}
        <Layout className="site-layout">
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={[route]} mode="horizontal">
            { props.role?.name == "admin" ? (
              <Menu.Item key="/">
                <DashboardOutlined />
                <Link href="/">
                  <a className='ml-2'>Dashboard</a>
                </Link>
              </Menu.Item>
            ) : "" }
            { props.role.name == "admin" ? (
              <Menu.Item key="/students">
                <TeamOutlined />
                <Link href="/students">
                  <a className='ml-2'>Students</a>
                </Link>
              </Menu.Item>
            ) : "" }
            { props.role.name == "admin" ? (
              <Menu.Item key="/teachers">
                <SolutionOutlined />
                <Link href="/teachers">
                  <a className='ml-2'>Teacher</a>
                </Link>
              </Menu.Item>
            ) : "" }
            { props.role.name == "admin" || props.role.name == "teacher" ? (
              <Menu.Item key="/sections">
                <ApartmentOutlined />
                <Link href="/sections">
                  <a className='ml-2'>Sections</a>
                </Link>
              </Menu.Item>
            ) : "" }
            { props.role.name == "admin" ? (
              <Menu.Item key="/subjects">
                <ReadOutlined />
                <Link href="/subjects">
                  <a className='ml-2'>Subjects</a>
                </Link>
              </Menu.Item>
            ) : "" }

          </Menu>
        </Header>
          <br />
          <Content style={{...containerLayout.containerStyle}} >
            <div {...containerLayout.containerChildDivClassName} style={{ padding: 24, minHeight: '100%' }}>
              {props.children}
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
    </div>
  );
}
export default connect(
  mapStateToProps,
)(Layouts);

