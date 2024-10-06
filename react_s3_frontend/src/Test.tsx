import AudioPlayer from "./components/audioplayer";

const Test = () => {
    return (
        <div className="flex flex-col items-center w-screen m-auto overflow-scroll">
            <AudioPlayer link='https://divhacks-fall-24.s3.amazonaws.com/20241006094957712097_0846e9be-6b6f-4b98-ad17-d317121e42df?AWSAccessKeyId=AKIA4MTWJRXE2CFOWCWF&Signature=9pbavZHnygi7FSCQ7yeFuSZPDug%3D&Expires=1728226250' picture='https://divhacks-fall-24.s3.amazonaws.com/20241006095050220883_linked_list_data_structure_68ea3773a6294397973bd81d76f2e9ec.webp?AWSAccessKeyId=AKIA4MTWJRXE2CFOWCWF&Signature=KdxMCQQCOaZuImVXuI3g4fAtUbI%3D&Expires=1728226250' title = "Linked Lists" description="dfcejskgbvkrb4e" />
        </div>
    );
}

export default Test;