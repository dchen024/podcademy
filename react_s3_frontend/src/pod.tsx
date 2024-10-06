import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header";

interface Pods {
    id: string;
    title: string;
    image_url: string;
}
const Pod = () => {
  const [pods, setPods] = useState<Pods[]>([]);
  const getPods = async (): Promise<any> => {
    try {
      const response = await fetch("http://127.0.0.1:5000/pods", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching pods:", error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchPods = async () => {
      try {
        const data = await getPods();
        setPods(data);
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };
    fetchPods();
  }, []);
  const navigate = useNavigate();

  const goToPod = (id: string) => {
    return navigate(`/pod/${id}`);
  };


  return (
    <div className="w-full mb-auto">
      <div className="flex flex-col items-center mx-40 mt-16">
      <Header showMyPods />
        {pods &&
          pods.map((p, idx) => (
            <button
              key={idx}
              className="flex items-center w-full p-4 my-4 bg-gray-200 rounded-3xl hover:bg-gray-400"
              onClick={() => goToPod(p.id)}
            >
              <img src={p.image_url} className="w-[40px] mr-6" />
              <h1 className="text-lg font-medium">{p.title}</h1>
            </button>
          ))}
      </div>
    </div>
  );
};

export default Pod;
