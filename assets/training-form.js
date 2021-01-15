$(document).ready(function () {
  // Cibles du DOM
  const $skillTemplate = $('#skillTemplate').clone().removeAttr('id');
  const $traineeTemplate = $('#traineeTemplate').clone().removeAttr('id');
  const $skillsContainer = $('#skillsContainer');
  const $traineeContainer = $('#traineesContainer');
  const $btAddSkill = $('#btAddSkill');

  $skillTemplate.find('input').val('');
  $traineeTemplate.find('input').val('');

  // Ajout d'une nouvelle compétence
  // au clic sur le bouton
  $btAddSkill.click(function () {
    $skillsContainer.append($skillTemplate.clone());
  });

  $('#btAddTrainee').click(function () {
    //alert('test');
    console.log($traineeTemplate);
    console.log($traineeContainer);
    $traineeContainer.append($traineeTemplate.clone());
  });

  $('body').delegate('.delete', 'click', function () {
    $(this).parent().parent().remove();
  });
});
