import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flex, Separator, Text } from "@chakra-ui/react";
import { mapList } from "./resources/mapList";
import { enemyList } from "./resources/enemyList";
import { generatePath } from "react-router-dom";
import Profile from "./Profile";

function Battle({ gameSave, setGameSave }) {

  const [report, setReport] = useState([]); //戰報

  const battle = (mapId) => {
    setReport([]); //清空戰報

    const { enemies } = mapList[mapId]; //取得該地點所有敵人
    //生成1~3名隨機敵人
    const minCount = 1;
    const maxCount = 3;
    const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    let selectedEnemies = generateEnemies(count, enemies);

    //console.log(selectedEnemies); //測試出現敵人

    //重複名稱檢查
    const nameCount = {}; //計算重複名字用

    selectedEnemies.forEach((enemy, i) => {
      // 檢查名字是否重複
      if (nameCount[enemy.name]) {
        nameCount[enemy.name]++;
        selectedEnemies[i].name += nameCount[enemy.name];
      } else {
        nameCount[enemy.name] = 1;
      }
    });

    selectedEnemies.map((enemy) => {
      const msg = { m: enemy.name + "出現了!", color: "teal" };

      setReport((prevReport) => {
        return [...prevReport, msg];
      });
    });

    //戰鬥資料
    const data = {
      friendly: [{ ...gameSave }], //友方
      enemies: [...selectedEnemies], //敵方
      round: 1, //回合數
      win: false, //是否勝利
      end: false, //戰鬥是否結束
      actionOrder: [], //行動序
    };

    //為雙方添加HP
    data.friendly.map((friendly) => {
      friendly.hp = friendly.maxHp;
    });
    data.enemies.map((enemy) => {
      enemy.hp = enemy.maxHp;
    });

    //戰鬥主迴圈
    while (!data.end) {
      const attacker = data.actionOrder.shift(); //抽出行動序第一位

      if (attacker === undefined) {
        //行動序已空
        data.actionOrder = setActionOrder(data); //再次決定行動序

        let msg = { m: "本回合行動序: ", color: "teal" };
        data.actionOrder.map((character, index) => {
          msg.m += character.name;
          if (index < data.actionOrder.length - 1) {
            msg.m += ">";
          }
        });

        setReport((prevReport) => {
          return [...prevReport, msg];
        });
      } else {
        //攻擊
        //判斷攻擊者是友方還是敵方，如果是，防禦者即為敵方，反之則為友方
        const isFrendly = data.friendly.includes(attacker);
        const defenderArray = isFrendly ? data.enemies : data.friendly;
        const defender =
          defenderArray[Math.floor(Math.random() * defenderArray.length)];

        const damage = Math.floor(Math.random() * (attacker.atk + 1)); //隨機傷害

        defender.hp -= damage; //扣血

        const msg = {
          m: `${attacker.name} 攻擊，對 ${defender.name} 造成了 ${damage} 點傷害`,
          color: "gray",
        };
        setReport((prevReport) => [...prevReport, msg]);
      }

      data.round++; //回合數+1
      deathCheck(data); //死亡檢測
      endOfTheBattle(data); //戰鬥結束檢測
    }
  };

  //戰鬥結束檢測
  function endOfTheBattle(data) {
    if (data.friendly.length <= 0) {
      const msg = { m: `你的眼前一黑`, color: "gray" };
      setReport((prevReport) => [...prevReport, msg]);
      data.win = false;
      data.end = true; //回傳戰鬥結束
      return;
    }

    if (data.enemies.length <= 0) {
      const msg = { m: `你贏了`, color: "teal" };
      setReport((prevReport) => [...prevReport, msg]);
      data.win = true;
      data.end = true;
      return;
    }

    if (data.round >= 300) {
      //回和數>=300，算輸
      const msg = { m: "雙方大戰了300回合但是不分上下", color: "teal" };
      data.win = false;
      data.end = true;
      return;
    }

    data.end = false;
  }

  //死亡檢測
  const deathCheck = (data) => {
    for (let i = data.friendly.length - 1; i >= 0; i--) {
      const character = data.friendly[i];
      if (character.hp <= 0) {
        const msg = { m: `${character.name} 倒下了`, color: "red" };
        setReport((prevReport) => [...prevReport, msg]);

        // 移除死亡角色
        data.friendly.splice(i, 1);
      }
    }

    for (let i = data.enemies.length - 1; i >= 0; i--) {
      const character = data.enemies[i];
      if (character.hp <= 0) {
        const msg = { m: `${character.name} 倒下了`, color: "red" };
        setReport((prevReport) => [...prevReport, msg]);

        // 移除死亡敵人
        data.enemies.splice(i, 1);
      }
    }
  };

  //設定行動序
  const setActionOrder = (data) => {
    // 將 randomSpd 新增到原始物件
    data.friendly.concat(data.enemies).forEach((character) => {
      character.randomSpd = Math.floor(Math.random() * (character.spd + 1));
    });

    // 依據 randomSpd 排序
    const actionOrder = data.friendly
      .concat(data.enemies)
      .sort((a, b) => b.randomSpd - a.randomSpd);

    return actionOrder;
  };
  
  //選取敵人
  const generateEnemies = (count, enemies) => {
    const selectedEnemies = [];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * enemies.length);
      const enemyId = enemies[randomIndex].id;
      const enemy = JSON.parse(
        JSON.stringify({ ...enemyList[enemyId], lv: enemies[randomIndex].lv })
      ); //複製角色資料
      selectedEnemies.push(enemy); //放入陣列     
    }

    return selectedEnemies;
  };

  if (!gameSave) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <Flex justify="center">
        <Flex direction="column" maxW="700px" w="90%">
          <Flex backgroundColor="gray.900" mt={4} p={4} borderRadius={8}>
            <Flex w="100%" direction="column">
              <Text fontWeight="bold" textStyle="lg">
                地點
              </Text>

              <Separator mt={2} mb={2} size="lg" borderColor="lightblue" />

              <Flex gap={2}>
                {Object.entries(mapList).map(([key, map]) => (
	              <Button key={map.name} onClick={() => battle(key)}>
                   {map.name}
	              </Button>
                ))}
              </Flex>

              <Text mt={4} fontWeight="bold" textStyle="lg">
                戰報
              </Text>

              <Separator mt={2} mb={2} size="lg" borderColor="lightyellow" />

              <Flex direction="column">
                {report.map((msg, index) => (
                  <Flex key={index}>
                    <Text mr={4} w={8} textAlign="right">
                      {index + 1}
                    </Text>
                    <Text color={msg.color}>
                      {msg.m}
                    </Text>
                  </Flex>
                ))}
                </Flex>

            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default Battle;