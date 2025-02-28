import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [userRole, setUserRole] = useState('participant'); // null (guest), 'participant', 'admin'

  const navigation = userRole === 'admin' ? [
    { name: 'Dashboard', href: '/admindashboard' },
    { name: 'Competition Management', href: '/admincomp' },
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
    <Disclosure as="nav" className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">

                <DisclosureButton className="p-2 z-52 text-neutral-600 hover:bg-neutral-100 hover:text-black">
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
                    <span className="text-black mt-1 font-raleway text-2xl font-extrabold ml-0.5">NMC</span>
                  </div>
                </div>

                <div className="hidden sm:flex sm:flex-1 sm:justify-end sm:space-x-4 mr-5">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-neutral-600 hover:bg-neutral-100 hover:text-black hover:rounded-sm px-3 py-2 
                      text-md mt-1 font-medium font-poppins"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto">
                {userRole ? (
                  <button
                    onClick={() => setUserRole(null)}
                    className="color-component-red rounded-md
                     hover:!bg-red-700 text-white px-4 py-2 "
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="color-component-red rounded-md
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
                  className="block text-neutral-600 hover:bg-neutral-100 hover:text-black hover:rounded-sm
                   px-3 py-2 rounded-md text-base font-medium"
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
