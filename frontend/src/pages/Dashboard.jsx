import { useParams } from "react-router-dom"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { useState, useEffect } from "react"
import axios from "axios";

export const Dashboard = () => {

    const {id} = useParams();
    console.log(id);
   const [balance,setbalance] = useState(0);
    //let balance = 0;


    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await axios.get(`http://localhost:3000/api/v1/user/${id}`);
            console.log(response.data.user);
            setbalance(response.data.user.balance);
          //  balance = response.data.user.balance;
      
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
    
        fetchUser();
      }, [id]);

   

    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={Math.floor(balance)} />
            <Users />
        </div>
    </div>
}
