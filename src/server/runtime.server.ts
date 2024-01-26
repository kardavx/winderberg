import Maid from "@rbxts/maid";
import serverData from "./module/serverData";

const maid = new Maid();

maid.GiveTask(serverData());
