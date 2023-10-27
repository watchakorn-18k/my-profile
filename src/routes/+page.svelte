<script lang="ts">
    let hour: number = new Date().getHours();
    let minute: number = new Date().getMinutes();
    let second: number = new Date().getSeconds();

    setInterval(() => {
        const currentDate = new Date();
        hour = currentDate.getHours();
        minute = currentDate.getMinutes();
        second = currentDate.getSeconds();
    }, 1000);
</script>

<div class="bg-base-200 flex flex-col gap-2 items-center text-white">
    <div
        class="hero min-h-screen bg-gradient-to-b from-base-200 to-primary from-[2rem] font-mono"
    >
        <div class="hero-content text-center">
            <div class="max-w-md">
                <div class="m-8">
                    <span class="countdown font-mono text-4xl">
                        <span style="--value:{hour}" />:
                        <span style="--value:{minute}" />:
                        <span style="--value:{second}" />
                    </span>
                </div>
                <h1 class="text-2xl font-bold">👋Hello, I'm wk18k</h1>
            </div>
        </div>
    </div>
</div>
