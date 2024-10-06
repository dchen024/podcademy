import { useState, useEffect } from "react";
import { redirect } from "react-router-dom";
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
  console.log(pods);

  const goToPod = async (id: string) => {
    return redirect(`http://127.0.0.1:5000/pods/${id}`);
  };
  return (
    <div>
      <h1 className="text-gray-500">Pod</h1>
      {pods &&
        pods.map((p, idx) => (
          <div
            onClick={() => {
              goToPod(p.id);
            }}
            key={idx}
          >
            <div>{p.title}</div>
          </div>
        ))}
    </div>
  );
};

export default Pod;
