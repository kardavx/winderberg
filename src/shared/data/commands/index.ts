// Module for storing command intellisense

import _do from "./do";
import me from "./me";
import say from "./say";

const commands: { [commandName in CommandsUnion]: string[] } & { clear: string[] } = {
	say,
	k: say,
	s: say,
	me: me,
	do: _do,
	try: me,
	clear: [],
};

export default commands;
