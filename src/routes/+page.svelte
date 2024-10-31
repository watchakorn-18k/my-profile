<script lang="ts">
  import resume from "$lib/assets/my_resume.pdf";
  let hour: number = new Date().getHours();
  let minute: number = new Date().getMinutes();
  let second: number = new Date().getSeconds();

  setInterval(() => {
    const currentDate = new Date();
    hour = currentDate.getHours();
    minute = currentDate.getMinutes();
    second = currentDate.getSeconds();
  }, 1000);

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = resume; // เปลี่ยนชื่อไฟล์และเส้นทางตามที่คุณต้องการ
    link.download = "resume_watchakorn_buddeewong.pdf"; // ชื่อไฟล์ที่จะแสดงเมื่อดาวน์โหลด
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
</script>

<div class="bg-base-200 flex flex-col gap-2 items-center text-white">
  <div
    class="hero min-h-screen bg-gradient-to-b from-base-300 to-base-100 from-[2rem] to-primary font-mono"
  >
    <div class="hero-content text-center">
      <div class="max-w-md flex flex-col gap-4">
        <div class="m-8">
          <span class="countdown font-mono text-4xl">
            <span style="--value:{hour}" />:
            <span style="--value:{minute}" />:
            <span style="--value:{second}" />
          </span>
        </div>
        <h1 class="text-2xl font-bold">👋Hello, I'm wk18k</h1>
        <a href="mailto:wk18k@proton.me" class="btn btn-primary">Contact Me</a>
        <button on:click={downloadFile} class="btn btn-neutral text-white"
          >Download My Resume</button
        >
      </div>
    </div>
  </div>
</div>
