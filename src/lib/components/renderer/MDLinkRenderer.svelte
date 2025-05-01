<script lang="ts">
    import { authFormStateStore } from '$lib/store/authFormStateStore';
 

    export let href: string;
    export let text: string;
    export let raw: string;

    const authPattern = /^https?:\/\/[^\/]+\/api\/chats\/authenticate\?session_id=[A-Za-z0-9-]+$/;
    let isAuthUrl:boolean = false;
 
    $: isAuthUrl = authPattern.test(href);
  
    function decodeHTMLEntities(encodedString: string) {
      const textArea = document.createElement('textarea');
      textArea.innerHTML = encodedString;
      return textArea.value;
    }
  
    function handleAuthUrl(authUrl: string) {
      authFormStateStore.set({ url: authUrl, show: true });
    
    }
  </script>
  
  {#if isAuthUrl}
    <button
      class="link-btn underline font-semibold text-blue-500"
      data-href={href}
      on:click={() => handleAuthUrl(href)}
    >
      {decodeHTMLEntities(text)}
    </button>
  {:else}
    <a href={href} target="_blank">
      {decodeHTMLEntities(text)}
    </a>
  {/if}
  