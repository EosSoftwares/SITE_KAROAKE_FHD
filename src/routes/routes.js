import DashboardLayout from '@/views/Fhd/Admin/DashboardLayout.vue';
import AuthLayout from '@/views/Pages/AuthLayout.vue';
// GeneralViews
import NotFound from '@/views/Fhd/Admin/NotFoundPage.vue';

import ComponentLayout from '@/views/ComponentLayout.vue'


const Home = () => import(/* webpackChunkName: "pages" */ '@/views/Home.vue');
//FHD
//Login
const Login = () => import(/* webpackChunkName: "pages" */ '@/views/Pages/Login.vue');
const Recovery = () => import(/* webpackChunkName: "pages" */ '@/views/Pages/Recovery.vue');
const Register = () => import(/* webpackChunkName: "pages" */ '@/views/Pages/Register.vue');
const Policy = () => import(/* webpackChunkName: "pages" */ '@/views/Pages/Policy.vue');

// FHD Auth
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '@/views/Fhd/Admin/Dashboard.vue');
const Profile = () => import(/* webpackChunkName: "dashboard" */ '@/views/Fhd/Admin/Profile/Index.vue');

const Produto = () => import(/* webpackChunkName: "dashboard" */ '@/views/Fhd/Admin/Produto/Index.vue');
const Cart = () => import(/* webpackChunkName: "dashboard" */ '@/views/Fhd/Admin/Cart/Index.vue');
const CheckoutProducts = () => import(/* webpackChunkName: "dashboard" */ '@/views/Fhd/Admin/Cart/Checkout.vue');

const Credito = () => import(/* webpackChunkName: "dashboard" */ '@/views/Fhd/Admin/Credito/Index.vue');
const Pacote = () => import(/* webpackChunkName: "dashboard" */ '@/views/Fhd/Admin/Pacote/Index.vue');
const Musica = () => import(/* webpackChunkName: "dashboard" */ '@/views/Fhd/Admin/Musica/Index.vue');

let authPages = {
  path: '/',
  component: AuthLayout,
  name: 'Authentication',
  children: [
    {
      path: '/',
      component: Home,
      name: 'Home'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/politica-de-privacidade',
      name: 'Politica',
      component: Policy
    },
    {
      path: '/recovery',
      name: 'Recuperar senha',
      component: Recovery
    },
    { path: '*', component: NotFound }
  ]
};

const routes = [
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/login',
    name: 'Dashboard',
    children: [
      {
        meta: {requiresAuth: true},
        path: 'dashboard',
        name: 'DashbHomeard',
        component: Dashboard
      },
      {
        path: 'user',
        name: 'user',
        component: ComponentLayout,
        children: [
          {
            meta: {requiresAuth: true},
            path: 'profile',
            name: 'profile',
            component: Profile
          }
        ]
      },
      {
        path: 'creditos',
        name: 'creditos',
        component: ComponentLayout,
        children: [
          {
            meta: {requiresAuth: false},
            path: '',
            name: 'credito',
            component: Credito
          }
        ]
      },
      {
        path: 'pacotes',
        name: 'pacotes',
        component: ComponentLayout,
        children: [
          {
            meta: {requiresAuth: false},
            path: '',
            name: 'pacote',
            component: Pacote
          }
        ]
      },
      {
        path: 'produtos',
        name: 'produtos',
        component: ComponentLayout,
        children: [
          {
            meta: {requiresAuth: false},
            path: '',
            name: 'produto',
            component: Produto
          }
        ]
      },
      {
        path: 'pedido',
        name: 'pedido',
        component: ComponentLayout,
        children: [
          {
            meta: {requiresAuth: true},
            path: 'carrinho',
            name: 'carrinho',
            component: Cart
          },
          {
            meta: {requiresAuth: true},
            path: 'finalizar',
            name: 'finalizar_produto',
            component: CheckoutProducts
          }
        ]
      },
      {
        path: 'musicas',
        name: 'musicas',
        component: ComponentLayout,
        children: [
          {
            meta: {requiresAuth: true},
            path: '',
            name: 'musica',
            component: Musica
          }
        ]
      },
    ]
  },
  authPages,
];

export default routes;
