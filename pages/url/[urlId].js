import { useRouter } from "next/router";
import { useEffect } from "react";

const RedirectPage = () => {
  const router = useRouter();
  const urlId = router.query.urlId;
  useEffect(() => {
    if (urlId === undefined) {
      return;
    }
    fetch(`/api/url/${urlId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not get url");
        }
        response.json().then((data) => {
          location.href = data.document[0].redirectTo;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [urlId]);
  return <div>Loading...</div>;
};

export default RedirectPage;
