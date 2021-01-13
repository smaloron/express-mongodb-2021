$(document).ready(function () {
  // Cibles du DOM
  const $template = $('#skillTemplate').clone().removeAttr('id');
  const $skillsContainer = $('#skillsContainer');
  const $btAddSkill = $('#btAddSkill');

  // Ajout d'une nouvelle compétence
  // au clic sur le bouton
  $btAddSkill.click(function () {
    $skillsContainer.append($template.clone());
  });
});
