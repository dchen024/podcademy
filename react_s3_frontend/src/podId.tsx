import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./components/header";
import AudioPlayer from "./components/audioplayer";

interface Pod {
  id: string;
  title: string;
  summary: string;
  media_url: string;
  image_url: string;
}

const PodID: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pod, setPod] = useState<Pod | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPodById = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/pods/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseText = await response.text();
      console.log("Response Text:", responseText);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = JSON.parse(responseText);
      setPod(data);
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching pod:", error);
      setError("Failed to fetch pod");
      throw error;
    }
  };
  

  useEffect(() => {
    const getpod = async () => {
        if (id) {
            await getPodById();
        } else {
            setError("Invalid pod ID");
        }
    }
    getpod();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!pod) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col items-center w-screen m-auto">
        <AudioPlayer
          link={pod.media_url}
          picture={pod.image_url}
          title={pod.title}
          description={pod.summary}
        />
      </div>
    </div>
  );
};

export default PodID;