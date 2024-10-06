

const AudioPlayer = ({ link, picture }: { link: string; picture: string }) => {
  const s3Link = link; // Replace with your S3 link

  return (
    <div>
    <img src={picture} alt='podcast' />
      <h1>Audio Player</h1>
      <audio controls>
        <source src={s3Link} type='audio/wav' />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;