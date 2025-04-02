import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AppContent } from '@/context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [userRole, setUserRole] = useState(null); // null (guest), 'participant', 'admin'
  const location = useLocation();
  const navigate = useNavigate();

  const {backendUrl, userData, setUserData, setIsLoggedIn} = useContext(AppContent)

  useEffect(()=>{
    if(userData) setUserRole(userData.role);
  }, [userData])

  if (location.pathname === '/login') {
    return (
      <Link
        to="/"
        className="fixed top-4 left-4 flex items-center justify-center 
                 w-10 h-10 rounded-full bg-white color-text-red 
                 hover:!bg-neutral-100 shadow-lg border-1 border-neutral-300"
      >
        <ChevronLeftIcon className="h-5" />
      </Link>
    );
  }

  const logOut = async() => {
    try {
      const {data} =await axios.post(backendUrl+'api/auth/logout')
      if(data.success){
        setUserRole(null)
        setIsLoggedIn(false)
        setUserData(null)

        toast.success(data.message)
        navigate('/')
      }
      else toast.error(data.message)

    } catch (error) {
      console.error(error.message)
    }
  }

  const navigation = userRole === 'admin' ? [
    { name: 'Dashboard', href: '/admindashboard' },
    { name: 'Competition', href: '/admincomp' },
    { name: 'Ticket', href: '/adminticket' },
  ] : userRole === 'participant' ? [
    { name: 'Home', href: '/userhome' },
    { name: 'Competition', href: '/usercomp' },
    { name: 'Help', href: '/userhelp' },
  ] : [
    { name: 'Welcome', href: '/' },
    { name: 'Competition', href: '/usercomp' },
    { name: 'Help', href: '/userhelp' },
  ];

  return (
    <Disclosure as="nav" className={`navbar font-poppins shadow-md fixed top-0 left-0 w-full 
      z-50 ${userRole === 'admin'? 'red-navbar' : 'bg-white'}`}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">

                <DisclosureButton className={`p-2 z-52 ${userRole === 'admin'? 'text-white red-hover' 
                : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:text-black'}`}>
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block size-7" />
                  ) : (
                    <Bars3Icon className="block size-7" />
                  )}
                </DisclosureButton>
              </div>
              
              <div className="flex flex-1 items-center sm:justify-between">
                {/* Logo */}
                <div className="absolute inset-x-0 flex justify-center sm:static sm:justify-start">
                  <div className="flex items-center space-x-1">
                    <img src="src/assets/logo_nmc.png" alt="Logo" className="h-8 w-8" />
                    <span className={`${userRole === 'admin' ? 'text-white' : 'text-black'}
                                        mt-1 font-raleway text-2xl font-extrabold ml-0.5`}>NMC</span>
                  </div>
                </div>

                <div className="hidden sm:flex sm:flex-1 sm:justify-end sm:space-x-4 mr-5">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${userRole === 'admin' ? 'text-white red-hover' : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:text-black'} 
                      hover:rounded-sm px-3 py-2 text-md mt-1 font-medium font-poppins 
                      ${location.pathname === item.href ? 'underline decoration-2 font-bold' : ''}
                      ${(location.pathname=='/usernewticket' && item.href==='/userhelp')?  'underline decoration-2 font-bold' : ''}`
                    }
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto">
                {userRole ? (
                  <button
                    onClick={logOut}
                    className={`px-4 py-2 font-poppins transition duration-200 ease text-sm shadow-sm font-semibold cursor-pointer rounded-md ${userRole === 'admin'? 'bg-white text-red-700 hover:bg-neutral-100' 
                      : 'hover:bg-red-700 text-white bg-red-600'}
                     `}
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="bg-red-600 text-sm transition duration-200 ease font-poppins shadow-sm font-semibold cursor-pointer rounded-md
                     hover:!bg-red-700 text-white px-4 py-2 "
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={`block ${userRole === 'admin'? 'text-white red-hover' 
                : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:text-black'} 
                  hover:rounded-sm ${location.pathname === item.href ? 'underline decoration-2 font-bold' : ''}
    px-3 py-2 rounded-md text-base font-medium`}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
