import React from "react";
import styles from "./styles.module.css";
import logo from "../../../../public/logo.png";
import Image from "next/image";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="ENATEGA Logo" className={styles.logo} />
        <h1>ENATEGA</h1>
      </div>
      <nav>
        <button className={styles.buttonlogin}>Login</button>
        <button className={styles.buttonsignup}>Sign up</button>
      </nav>
    </header>
  );
};

export default Header;
