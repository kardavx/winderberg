// Module for storing command functionalities

import doCommand from "./do";
import k from "./k";
import me from "./me";
import s from "./s";
import say from "./say";
import tryCommand from "./try";

const commands: { [commandName in CommandsUnion]: CommandServerData } = {
	say,
	k,
	s,
	me,
	do: doCommand,
	try: tryCommand,
};

export default commands;
