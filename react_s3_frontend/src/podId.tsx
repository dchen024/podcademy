import { useEffect, useState } from "react";
import Header from "./components/header";
import AudioPlayer from "./components/audioplayer";

const PodID = (params: any) => {
  const [pods, setPods] = useState<any[]>([]);

  const getPodById = async (id: string): Promise<any> => {
    try {
      const response = await fetch(`/pods/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setPods((prevPods) => [...prevPods, data]);
      return data;
    } catch (error) {
      console.error("Error fetching pod:", error);
      throw error;
    }
  };

  useEffect(() => {
    const id = params?.id;
    if (id) {
      getPodById(id);
    }
  }, [params]);

  return (
    <div>
      <Header></Header>
      <div className="flex flex-col items-center w-screen m-auto">
        <Audioplayer
          link={data.link}
          picture={data.picture}
          title={data.title}
        />
      </div>
    </div>
  );
};

export default PodID;
