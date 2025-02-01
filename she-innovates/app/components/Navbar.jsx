import React from "react";

function Navbar() {
  return (
    <div className="bg-pittBlue shadow p-6 mb flex items-center justify-center">
      <img src="/panther.png" alt="" className="h-12 w-12 mr-4" />
      <h1 className="text-4xl font-bold text-white">Pitt Finance Dashboard</h1>
    </div>
  );
}

export default Navbar;
