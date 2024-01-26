import { ClientProducer } from "shared/reflex/clientState";
import { ProfileProducer } from "shared/reflex/serverProfile";
import { ServerProducer } from "shared/reflex/serverState";

export interface CommonProps {
	clientState: ClientProducer;
	serverProfile: ProfileProducer;
	serverState: ServerProducer;
}

export interface RouterProps {
	clientState: ClientProducer;
	serverProfile?: ProfileProducer;
	serverState?: ServerProducer;
}
