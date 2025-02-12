
<script>
    let { children } = $props();
    import AButton from "./AButton.svelte";
    import BuyPass from "./BuyPass.svelte";
</script>
<div>
    <div
        class="borderwrap"
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        data-aos-duration="1000"
    >
        <div class="inner"></div>

        <div class="wrapper active">
            <div class="daycards">
                <div class=" ">
                    <div class=" p-10">
                        {@render children()}      
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</div>




<style>
.borderwrap {
    position: relative;
    cursor: pointer;
    width: 100%;
    height: auto;
    margin-right: 0%;
    transition: all 0.3s ease-in-out;
    display: inline-block;
}

.wrapper {
    position: relative;
    width: 100%;
    min-height: 500px; 
    padding: 2px;
    background: linear-gradient(180deg, #AB83FE 0%, #ffc089 79%);
    transition: all 0.3s;
}


.daycards {
    background-color: black;
    color: white;
    z-index: 1;
    transition: all 0.3s ease-in-out;
    font-family: var(--title);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5%;
    min-height: 500px; 
    min-width: 100%;
}

.inner {
    height: 100%;
    width: 100%;
    position: absolute;
    background: linear-gradient(180deg, #AB83FE 0%, #ffc089 79%);
}

.wrapper:hover {
    transform: translate(-7px, -11px);
    transition: 300ms;
}

/* Mobile Responsive Styles */
@media screen and (max-width: 768px) {
    .wrapper{
        
        max-width: 400px;
        min-height: 480px; 
        padding: 1%;
        display: flex;
        justify-content: center;
        margin-left: 12%;
        margin-right: 5%;
        
    }
    .daycards {
        
        max-width: 400px; 
        min-height: 500px; 
        padding: 1%; 
        margin-left: 0px;
    }

    
    .inner{
        max-width: 400px;
        align-self: center;
        margin-left: 12%;

    }

    
}

@media screen and (max-width: 480px) {
    .wrapper{
        max-width: 300px; 
        min-width: 95%;
        min-height: 450px; 
        padding: 1%;
        margin-left: 0px;
    }
    .daycards {
        max-width: 300px; 
        min-width: 95%;
        min-height: 450px;
        padding: 1%; 
        margin-left: 0px;
    }
    .inner{
        max-width: 300px;
        margin-left: 0px;
    }
    
}

</style>