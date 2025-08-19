import { Bounce, toast } from "react-toastify";

export const VIDEO_FORMATS = ['mp4', 'mov'];

export const getIsImageFormat = (fileName) => {
    const spilltedFileName = fileName?.split('.');
    const fileFormat = spilltedFileName[spilltedFileName.length - 1];
    return !VIDEO_FORMATS.includes(fileFormat?.toLowerCase());
}


export const openToast = (message, isError = true) => {
    toast[isError ? 'error' : 'success'](message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });
}

export const NOTIFICATION_TYPES = {
    GROUP: 'GROUP',
    COLLAB: 'COLLAB'
}

export const STATUS = {
    APPROVED: "APPROVED",
    REQUESTED: "REQUESTED",
    REJECTED: "REJECTED"
}

export const POST_TYPES = {
    SELF: "SELF",
    EVENT: "EVENT",
    COLLAB: "COLLAB"
}

// If the post is not created by current user
export const getMemberFromMembers = (members) => {
    const userId = localStorage.getItem("USER_ID");
    return members?.find((obj) => userId === obj.userId);
}

export const capitalizeParagraph = (paragraph) => {
    const sentences = paragraph.split(/([.!?])\s*/);

    const capitalizedSentences = sentences.map((sentence, index) => {
        if (index % 2 === 0) {
            return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
        }
        return sentence;
    });

    return capitalizedSentences.join('');
}

