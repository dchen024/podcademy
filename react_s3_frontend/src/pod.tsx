import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header";
const Pod = () => {
  const [pods, setPods] = useState([]);
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
      <Header showMyPods />
      <div className="mx-40 mt-16">
        {pods &&
          pods.map((p, idx) => (
            <button
              key={idx}
              className="w-full flex items-center my-4 bg-gray-300 rounded-3xl p-4 hover:bg-gray-400"
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
