import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones } from "@fortawesome/free-solid-svg-icons";

interface HeaderProps {
  showMyPods?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showMyPods }) => {
  return (
    <div className="flex justify-between items-center p-4 m-4">
      <div className="flex items-center">
        <div className="flex items-center">
          <h1 className="font-bold text-3xl hover:text-gray-600">podcademy</h1>
        </div>
        <FontAwesomeIcon
          icon={faHeadphones}
          className="h-[30px] w-[30px] ml-4"
        />
      </div>
      <div className="flex gap-4 items-center">
        {showMyPods && (
          <a className="text-xl underline hover:text-gray-600" href="/pod">
            my pods
          </a>
        )}
      </div>
    </div>
  );
};

export default Header;
