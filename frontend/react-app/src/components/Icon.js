import {
  MdLink,
  MdFavoriteBorder,
  MdFavorite,
  MdOutlineShare,
  MdArrowBack,
  MdHelpOutline,
  MdCheck,
  MdAdd,
  MdDeleteOutline,
  MdOutlineEdit,
  MdMenu,
  MdSearch,
  MdOutlineHome,
  MdErrorOutline,
  MdOutlineVpnKey,
  MdOutlineLogout,
  MdOutlineNoAccounts,
  MdOutlineCreateNewFolder,
  MdOutlineFolderOff,
  MdHistory,
  MdClose,
  MdOutlineAccountCircle,
} from "react-icons/md";
import { RiYoutubeLine, RiFlickrLine, RiTwitterLine } from "react-icons/ri";
import { SiGiphy } from "react-icons/si";
import { TbHeartOff } from "react-icons/tb";
import { LiaLine } from "react-icons/lia";

export {
  MdLink,
  MdFavoriteBorder,
  MdFavorite,
  MdOutlineShare,
  MdArrowBack,
  RiYoutubeLine,
  RiFlickrLine,
  SiGiphy,
  MdHelpOutline,
  MdCheck,
  MdAdd,
  MdDeleteOutline,
  MdOutlineEdit,
  MdMenu,
  MdSearch,
  MdOutlineHome,
  MdErrorOutline,
  MdOutlineVpnKey,
  MdOutlineLogout,
  MdOutlineNoAccounts,
  MdOutlineCreateNewFolder,
  MdOutlineFolderOff,
  TbHeartOff,
  LiaLine,
  RiTwitterLine,
  MdHistory,
  MdClose,
  MdOutlineAccountCircle,
};

export const serviceIcons = {
  YouTube: RiYoutubeLine,
  Flickr: RiFlickrLine,
  GIPHY: SiGiphy,
};

export function setServiceIcon(service_name) {
  return serviceIcons[service_name] || MdHelpOutline;
}
