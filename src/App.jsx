import { useState , useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button"
import { Routes, Route, useNavigate} from "react-router-dom"
import { Flex } from "@chakra-ui/react"
import Profile from "./Profile";
import Battle from "./Battle";

function App() {
  const navigate = useNavigate();
  const [gameSave, setGameSave] = useState(null);

  const menuItems = [
    { label: "角色", path: "/", element: <Profile gameSave={gameSave} setGameSave={setGameSave} />, color: "cyan"},
    { label: "戰鬥", path: "/battle", element: <Battle gameSave={gameSave} setGameSave={setGameSave}/> , color: "red"},
    { label: "膜拜", path: "/worship", element: <>膜拜大木神</> , color: "purple"},
  ];

  // 檢查存檔
  const loadGameSave = () => {
    const data = localStorage.getItem("gameSave");
    if (!data) {
      //如果存檔不存在，則建立新存檔
      const newData = {
        name: "好耶",
        lv: 1,
        exp: 0,
        nextExp: 100,
        money: 100,
        maxHp: 10,
        atk: 10,
        def: 10,
        spd: 10,
        int: 10,
        luk: 10,
        totalWin: 0,
        totalLose: 0,
        skillPoint: 10,
        STR: 0,
        INT: 0,
        VIT: 0,
        AGI: 0,
        DEX: 0,
        LUK: 0,
      };
      localStorage.setItem("gameSave", JSON.stringify(newData));
      console.log("已建立新檔");

      return newData;
    } else {
      console.log("已讀取存檔");

      return JSON.parse(data);
    }
  };

  useEffect(() => {
    setGameSave(loadGameSave());
  }, []);

  /*useEffect(() => {
    console.log(gameSave);
  }, [gameSave]);*/

  return (
    <>
      {/*迴圈生成按鈕*/}
      <Flex
      backgroundColor={"gray.700"}
      margin={2}
      gap={2}
      padding={3}
      justify="center">
      {menuItems.map((item) => (
        <Button key={item.path} variant="subtle" colorPalette={item.color} onClick={() => navigate(item.path)}>
          {item.label}
        </Button>
      ))}
      </Flex>
      <Routes>
        {/*迴圈生成Route*/}
        {menuItems.map((item) => (
          <Route key={item.path} path={item.path} element={item.element} />
        ))}
      </Routes>
    </>
  );
}

export default App