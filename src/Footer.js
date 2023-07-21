import { Children } from "react"
import React, { useState } from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import logo from './assets/presscheck406x192.png';

const Footer = () => {
  return (
    <footer className="footer py-4 d-flex justify-content-center">
            <p>&copy; 2023 PresCheck - Universidade Lusófona</p>
    </footer>
  );
};

export default Footer;