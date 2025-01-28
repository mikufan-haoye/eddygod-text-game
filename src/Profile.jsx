import { useState , useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Flex , Separator, Text } from "@chakra-ui/react";

function Profile({ gameSave, setGameSave }) {
  const statItems = [
    { label: "STR" },
    { label: "AGI" },
    { label: "VIT" },
    { label: "INT" },
    { label: "DEX" },
    { label: "LUK" },
  ];

  if (!gameSave) {
    return <Text>Loading...</Text>;
  }

  const [initialStats, setInitialStats] = useState(null);

  useEffect(() => {
    if (!initialStats && gameSave) {
      setInitialStats({ ...gameSave });
    }
  }, [gameSave]);

  const addSkillPoint = (stat, value) => {
    const initialValue = initialStats[stat];

    if (value > 0 && gameSave.skillPoint > 0) {
      gameSave[stat] += value;
      gameSave.skillPoint -= value;
      setGameSave({ ...gameSave });
    } else if (value < 0 && gameSave[stat] + value >= initialValue) {
      gameSave[stat] += value;
      gameSave.skillPoint -= value;
      setGameSave({ ...gameSave });
    }
  };

  //儲存加點
  const saveSkillPonit = () => {
    const newGameSave = { ...gameSave };
    newGameSave.maxHp = 100 + newGameSave.VIT * 10;
    newGameSave.atk = 10 + newGameSave.STR * 2 + newGameSave.DEX * 1;
    newGameSave.def = 10 + newGameSave.VIT * 2;
    newGameSave.spd = 10 + newGameSave.AGI * 2 + newGameSave.DEX * 1;
    newGameSave.int = 10 + newGameSave.INT * 2;
    newGameSave.luk = 10 + newGameSave.LUK * 2;

    setGameSave(newGameSave);
    setInitialStats(newGameSave);
    localStorage.setItem("gameSave", JSON.stringify(newGameSave));
  };

  return (
    <Flex justify="center">
      <Flex
        direction="column">
        <Flex
            backgroundColor="gray.900"
            w = "1000px"
            h = "260px"
            borderRadius="xl"
            mt={4}
            p={4}
            direction="column"
            >
            <Flex direction="column">
              <Text fontSize="lg" fontWeight="bold">
                角色
              </Text>

              <Separator orientation="horizontal" mt={2} mb={2} size="lg" variant="solid" borderColor="lightgreen"/>
            </Flex>
            
            <Flex>
            <Flex w="160px">
                  <Text fontSize="md" fontWeight="bold">{gameSave.name}</Text>
                </Flex>
                <Flex w="160px">
                  <Text>等級&nbsp;:&nbsp;{gameSave.lv}</Text>
                </Flex>
                <Flex w="160px">
                  <Text>經驗&nbsp;:&nbsp;{gameSave.exp}&nbsp;/&nbsp;{gameSave.nextExp}</Text>
                </Flex>
                <Flex w="160px">
                  <Text>金幣&nbsp;:&nbsp;{gameSave.money}</Text>
                </Flex>
              </Flex>

              <Separator orientation="vertical" mt={0.5} mb={2} size="sm" />
              <Separator orientation="horizontal" mt={2} mb={2} size="md" variant="dashed" borderColor="gray.600" />
              <Separator orientation="vertical" mt={0.5} mb={2} size="sm" />

              <Flex>
                <Flex w="160px">
                  <Text>血量&nbsp;:&nbsp;{gameSave.maxHp}</Text>
                </Flex>
                <Flex w="160px">
                  <Text>攻擊&nbsp;:&nbsp;{gameSave.atk}</Text>
                </Flex>
                <Flex w="160px">
                  <Text>防禦&nbsp;:&nbsp;{gameSave.def}</Text>
                </Flex>
              </Flex>

              <Separator orientation="vertical" mt={0.5} mb={2} size="sm" />

              <Flex>
                <Flex w="160px">
                  <Text>速度&nbsp;:&nbsp;{gameSave.spd}</Text>
                </Flex>
                <Flex w="160px">
                  <Text>智力&nbsp;:&nbsp;{gameSave.int}</Text>
                </Flex>
                <Flex w="160px">
                  <Text>幸運&nbsp;:&nbsp;{gameSave.luk}</Text>
                </Flex>
              </Flex>

              <Separator orientation="vertical" mt={0.5} mb={2} size="sm" />
              <Separator orientation="horizontal" mt={2} mb={2} size="md" variant="dashed" borderColor="gray.600" />
              <Separator orientation="vertical" mt={0.5} mb={2} size="sm" />

              <Flex>
              <Flex w="160px">
                <Text>勝場&nbsp;:&nbsp;{gameSave.totalWin}</Text>
              </Flex>
              <Flex w="160px">
                <Text>敗場&nbsp;:&nbsp;{gameSave.totalLose}</Text>
                </Flex>
              </Flex>
        </Flex>

        <Flex
            backgroundColor="gray.900"
            w = "1000px"
            h = "260px"
            borderRadius="xl"
            mt={4}
            p={4}
            direction="column"
            >
            <Flex direction="column">
              <Text fontSize="lg" fontWeight="bold">
                強化
              </Text>

              <Separator orientation="horizontal" mt={2} mb={2} size="lg" variant="solid" borderColor="cyan"/>

              <Flex w="100%"  align="center" justify="space-between">
                <Text>剩餘點數&nbsp;:&nbsp;{gameSave.skillPoint}</Text>

                <Button variant="subtle" size="md" onClick={() => saveSkillPonit()}>儲存加點</Button>
              </Flex>

              <Separator orientation="vertical" mt={0.5} mb={2} size="sm" />
              <Separator orientation="horizontal" mt={2} mb={2} size="md" variant="dashed" borderColor="gray.600" />
              <Separator orientation="vertical" mt={0.5} mb={2} size="sm" />

              <Flex wrap="wrap">
              {statItems.map((stat, index) => (
                  <Flex w="300px" align="center" justify="flex-start" key={index} mb={2}>
                    <Text w="45px">{stat.label}&nbsp;:&nbsp;</Text>
                    <Button variant="surface" size="xs" mr={2} onClick={() => addSkillPoint(stat.label, -1)}>
                      -1
                    </Button>
                    <Text w="25px" textAlign="center">
                      {gameSave[stat.label]}
                    </Text>
                    <Button variant="surface" size="xs" ml={2} onClick={() => addSkillPoint(stat.label, 1)}>
                      +1
                    </Button>
                  </Flex>
                ))}
              </Flex>
            </Flex>

        </Flex>
      </Flex>  
    </Flex>
    
  )
}

export default Profile;