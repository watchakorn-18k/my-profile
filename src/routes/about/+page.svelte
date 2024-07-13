<script lang="ts">
  import { onMount } from "svelte";
  import { fetchData } from "$lib/waketime";
  import DisplayData from "./DisplayData.svelte";

  let waketimes: any[];
  let resp: any;
  let maxPercentData: number;

  onMount(async () => {
    try {
      resp = await fetchData();
      waketimes = resp.data;
      maxPercentData = waketimes[0].percent;
    } catch (error) {
      console.error("Error in fetchData:", error);
    }
  });
</script>

<div>
  <DisplayData {waketimes} {maxPercentData} />
</div>
