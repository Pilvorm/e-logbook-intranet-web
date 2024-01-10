import React from 'react';
import { Navbar, NavItem, NavLink, UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,} from "reactstrap";
import { Menu, Power } from "react-feather";
import Image from 'next/image';
import { signOut } from 'next-auth/react';

const HomeHeader = ({
    user
}) => {
    return (
        <div>
            <div 
                style={{
                    backgroundColor: '#33725b', 
                    minHeight: 200,
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                    position: 'relative'
                }}
            >
                <Navbar
                    expand="lg"
                    light
                    className="header-navbar navbar align-items-center floating-nav navbar-shadow"
                    style={{backgroundColor: '#46a583'}}
                >
                    <div className="navbar-container d-flex content">
                    <NavItem className="mobile-menu mr-auto d-flex justify-content-between w-100">
                        <NavLink
                            className="nav-menu-main menu-toggle hidden-xs is-active"
                            onClick={() => setMenuVisibility(true)}
                        >
                            <Image src={require("public/icons/home_icons/kalbe-white.png")} width={72} height={30} />
                        </NavLink>
                        <NavLink
                            className="nav-menu-main menu-toggle hidden-xs is-active"
                            // onClick={() => setMenuVisibility(true)}
                        >
                            <UncontrolledDropdown className="dropdown-user nav-item">
                                <DropdownToggle
                                    href="/"
                                    tag="a"
                                    // className="nav-link dropdown-user-link"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <Menu className="ficon" color={"white"} style={{marginTop: 7}} />
                                </DropdownToggle>
                                <DropdownMenu
                                    style={{marginLeft: -90, zIndex: 222}}
                                >
                                    <DropdownItem className="dropdown-item w-100" 
                                        onClick={() => {
                                            if (typeof window !== "undefined") {
                                                localStorage.clear();
                                              }
                                            signOut();
                                        }}
                                    >
                                        <Power size={14} className="mr-75" />
                                        <span className="align-middle">Logout</span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </NavLink>
                    </NavItem>
                    </div>
                </Navbar>
                <div className="header-navbar navbar align-items-center floating-nav navbar-shadow d-flex justify-content-between"
                    style={{
                        position: 'absolute',
                        bottom: 5,
                    }}
                >
                    <div>
                        <h6 style={{color: 'white'}}>Welcome Back,</h6>
                        <h3 style={{fontWeight: 800, color: 'white', overflow: 'auto'}}>{user.Name ?? "John Doe"}</h3>
                        {
                            user.CompName &&
                            <h6 style={{fontWeight: 800, color: 'white', overflow: 'auto'}}>{user.CompName}</h6>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

export default HomeHeader;