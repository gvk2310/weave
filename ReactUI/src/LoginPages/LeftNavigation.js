import React from 'react';
import './Login.css'
import SideBar from './sidebar';

// function LeftNavigation(){
//     return(
//         <header className="sidenav">
//             <nav className="toolbar-navigation">
//                 <div></div>
//                 <div className="logo">MENU</div>
//                 <div className="toolbar-navigation-items">
//                     <ul className="sidebar">
//                         <li><a href="#">User</a></li>
//                         <li><a href="#">Home</a></li>
//                         <li><a href="#">Services</a></li>
//                     </ul>
//                 </div>
//             </nav>
//         </header>
//     )
// } 
// export default LeftNavigation;

// import React from 'react';
// import SideBar from './sidebar';

// import './App.css';

export default function LeftNavigation() {
  return (
    <div id="App">
      <SideBar />
      <div id="page-wrap">
        <h1>AppDividend</h1>
        <h2>Check out our tutorials the side menubar</h2>
      </div>
    </div>
  );
}
