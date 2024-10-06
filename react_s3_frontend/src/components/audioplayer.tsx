const AudioPlayer = ({
    link,
    picture,
    title,
    description,
  }: {
    link: string;
    picture: string;
    title: string;
    description: string;
  }) => {
    return (
      <div className="flex flex-col items-center w-full h-screen p-4 bg-gradient-to-br from-gray-100 to-gray-300">
        {/* Responsive Image */}
        <img
          className="mt-8 transition-transform duration-300 ease-in-out transform rounded-lg shadow-lg w-80 h-80 md:w-96 md:h-96 hover:scale-105"
          src={picture}
          alt="Podcast cover"
           // Fallback image
        />
  
        {/* Title */}
        <h1 className="mt-4 text-3xl font-bold text-center text-gray-800">{title}</h1>
  
        {/* Audio Player */}
        <audio className="mt-4 w-80 md:w-96" controls>
          <source src={link} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
  
        {/* Summary */}
        <p className="mt-8 text-lg text-gray-700">Summary</p>
        <p className="mt-2 text-center text-gray-600">{description}</p>
  
        {/* Download and Share Buttons */}
        <div className="flex mt-8 space-x-4">
          <a
            href={link}
            download
            className="px-4 py-2 font-semibold text-white transition duration-300 ease-in-out bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
          >
            Download
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(link)}
            className="px-4 py-2 font-semibold text-white transition duration-300 ease-in-out bg-green-500 rounded-lg shadow-md hover:bg-green-600"
          >
            Copy Link
          </button>
        </div>
      </div>
    );
  };
  
  export default AudioPlayer;
  