import Link from "next/link";

import {Button} from "../button/button";
import {Heading} from "../heading/heading";
import {Text} from "../text/text";

export function NotFoundContent() {
  return (
    <div className="align-center flex min-h-[calc(100dvh-4rem)] flex-col justify-center gap-4 px-4 text-center md:min-h-[calc(100dvh-5rem)]">
      <Heading as="h1" variant="title.0">
        404
      </Heading>
      <Text className="mx-auto max-w-140" variant="body.1">
        The page you are looking for probably doesn’t exist. Go to our home or get in touch to find
        what you’re looking for.
      </Text>
      <Button asChild className="mx-auto mt-2" variant="primary">
        <Link href="/">Go to Home Page</Link>
      </Button>
    </div>
  );
}
