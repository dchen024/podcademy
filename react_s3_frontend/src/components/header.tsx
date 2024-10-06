import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  showMyPods?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showMyPods }) => {
  return (
    <>
      <div className="flex items-center ">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold hover:text-gray-600">podcademy</h1>
        </div>
        <FontAwesomeIcon
          icon={faHeadphones}
          className="h-[30px] w-[30px] ml-4"
        />
      </div>
      </>
  );
};

export default Header;
