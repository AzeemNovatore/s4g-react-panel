import { fetchAllBanners } from "../services/firebase/actions";
import { useState, useEffect } from "react";
import { LoaderContext } from "../context/loadingContext";
import { useContext } from "react";

export default function useBanners() {
  const [bannerDetails, setBannerDetails] = useState(null);
  const { setLoading } = useContext(LoaderContext);

  const getallImages = async () => {
    try {
      setLoading(true);
      await fetchAllBanners().then((resp) => setBannerDetails(resp ?? null));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getallImages();
  }, []);

  return { bannerDetails, getallImages };
}
